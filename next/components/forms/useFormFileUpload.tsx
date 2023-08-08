import { formsApi } from '@clients/forms'
import { GetFileResponseDto } from '@clients/openapi-forms'
import { useQuery } from '@tanstack/react-query'
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useIsMounted } from 'usehooks-ts'

import { environment } from '../../environment'
import {
  FormFileUploadClientFileInfo,
  FormFileUploadClientFileStatus,
  FormFileUploadConstraints,
  FormFileUploadContextType,
  FormFileUploadFileInfo,
  FormFileUploadStatusEnum,
} from '../../frontend/types/formFileUploadTypes'
import { InitialFormData } from '../../frontend/types/initialFormData'
import {
  getFileInfoForNewFiles,
  mergeClientAndServerFiles,
  shouldPollServerFiles,
  uploadFile,
} from '../../frontend/utils/formFileUpload'

const FormFileUploadContext = createContext<FormFileUploadContextType | undefined>(undefined)

export type FormFileUploadStateProviderProps = {
  initialFormData: Pick<InitialFormData, 'files' | 'formId'>
}

const REFETCH_INTERVAL = 5000

/**
 * This service handles the state for file upload. There are two types of files:
 *  - Client files: files that are being uploaded by the user
 *  - Server files: files that have been uploaded to the server
 *
 *  After the user triggers the upload of a file, the id of the file is immediately generated, and it is added to the
 *  client files list. `clientFiles` also holds the state of the upload (queued, uploading, ...) and acts as the queue
 *  of files to be uploaded. On every change the list is checked whether there's a file that needs to be uploaded and if
 *  so, it's uploaded.
 *
 *  One of many reasons that ids are generated by the client are:
 *  - The upload widget is rendered on the particular step, but the service also uploads the file on the background.
 *    as the id is immediately persisted in form data (before the upload even starts), there's no need for update of the
 *    form data when the upload is done by the widget that might not be rendered anymore.
 *
 *                      the upload component wouldn't be able to update the form data ˅
 *    Form file upload component   |---------------| detached |----------------| detached
 *    File upload                        |--------------------------------------------|
 *                                       ^ file id is generated and persisted in form data
 *
 *  - The form can be saved as a concept while the file is uploading.
 *
 *  At the end, the client and server files are merged and returned to the consumer.
 */
export const FormFileUploadStateProvider = ({
  initialFormData,
  children,
}: PropsWithChildren<FormFileUploadStateProviderProps>) => {
  const isMounted = useIsMounted()

  // The client files are both stored in the state and in the ref. The state is used to trigger re-rendering of the
  // component, while the ref is used to get the current value of the client files. The ref is used in the functions
  // that need the immediate access to the current value of the client files. (As opposed to the state, which is
  // updated asynchronously.) For example, when triggering `uploadFiles` and `removeFile` functions right after each other,
  // the current value of the client files is needed immediately. Also, the `uploadFile` callback would not have access
  // to the current value of the client files if it was stored only in the state.
  // The state should be only modified by the `updateClientFiles` function.
  const [clientFiles, setClientFiles] = useState<FormFileUploadClientFileInfo[]>([])
  const clientFilesRef = useRef(clientFiles)
  const getClientFiles = useCallback(() => clientFilesRef.current, [])

  const abortControllersRef = useRef<Record<string, AbortController>>({})

  const refetchInterval = useMemo(() => {
    return (data: GetFileResponseDto[] | undefined) =>
      shouldPollServerFiles(data, clientFiles) ? REFETCH_INTERVAL : false
  }, [clientFiles])

  const serverFilesQuery = useQuery(
    ['serverFiles', initialFormData.formId],
    async () => {
      const response = await formsApi.filesControllerGetFilesStatusByForm(initialFormData.formId, {
        accessToken: 'onlyAuthenticated',
      })
      return response.data
    },
    {
      retry: Infinity, // Retry infinitely
      retryDelay: 5000, // Retry every 5 seconds
      staleTime: Infinity,
      refetchInterval,
      initialData: initialFormData.files,
    },
  )

  /**
   * Updates client files and handles side effects of the change if needed. This is the only place that should trigger
   * `setClientFiles` and/or modify `clientFilesRef.current`.
   */
  const updateClientFiles = (newClientFiles: FormFileUploadClientFileInfo[]) => {
    if (!isMounted()) {
      return
    }

    clientFilesRef.current = newClientFiles
    setClientFiles(newClientFiles)

    /**
     * Verifies if there's a file that needs to be uploaded and schedules it if needed.
     */
    const scheduleUploadIfNeeded = async () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const isAlreadyUploadingFile = newClientFiles.some(
        (item) => item.status.type === FormFileUploadStatusEnum.Uploading,
      )
      const firstQueuedFile = newClientFiles.find(
        (file) => file.status.type === FormFileUploadStatusEnum.UploadQueued,
      )

      if (isAlreadyUploadingFile || !firstQueuedFile) {
        return
      }

      const updateFileStatus = (status: FormFileUploadClientFileStatus) => {
        const clientFilesWithUpdatedStatus = clientFilesRef.current.map((file) => {
          if (file.id === firstQueuedFile.id) {
            return { ...file, status }
          }
          return file
        })

        updateClientFiles(clientFilesWithUpdatedStatus)
      }

      const abortController = new AbortController()
      abortControllersRef.current[firstQueuedFile.id] = abortController

      updateFileStatus({
        type: FormFileUploadStatusEnum.Uploading,
        progress: 0,
      })

      await uploadFile({
        formId: initialFormData.formId,
        file: firstQueuedFile.file,
        id: firstQueuedFile.id,
        abortController,
        onSuccess: () => {
          updateFileStatus({ type: FormFileUploadStatusEnum.UploadDone })

          // This forces server files to be refetched and get scanning status for the uploaded file.
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          serverFilesQuery.refetch()
        },
        onError: (error) => {
          updateFileStatus({
            type: FormFileUploadStatusEnum.UploadError,
            // TODO: Error message logic
            error: error.toString(),
            canRetry: true,
          })
        },
        onProgress: (progress) => {
          updateFileStatus({
            type: FormFileUploadStatusEnum.Uploading,
            progress,
          })
        },
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    scheduleUploadIfNeeded()
  }

  const uploadFiles = (files: File[], constraints: FormFileUploadConstraints) => {
    const newFiles = getFileInfoForNewFiles(files, constraints)

    updateClientFiles([...getClientFiles(), ...newFiles])

    return newFiles.map((file) => file.id)
  }

  const removeFiles = (ids: string[]) => {
    // Abort uploading files that are being removed.
    getClientFiles()
      .filter((file) => ids.includes(file.id))
      .forEach((file) => {
        if (file.status.type === FormFileUploadStatusEnum.Uploading) {
          abortControllersRef.current[file.id]?.abort()
        }
      })

    updateClientFiles(getClientFiles().filter((file) => !ids.includes(file.id)))
  }

  /**
   * This function is called after every form data change. This assures only files that are still in the form data are
   * kept. E.g. if a conditional field containing a file is removed, the X button is not clicked, so we need to parse
   * the form data and remove files that are not there anymore.
   * @param ids
   */
  const keepFiles = (ids: string[]) => {
    const filesToRemove = getClientFiles().filter((file) => !ids.includes(file.id))
    removeFiles(filesToRemove.map((file) => file.id))
  }

  /**
   * Files are retried in a way that the same File object is reused, but a new id is generated for it.
   * It wouldn't be possible to reuse the same id as the server might flag it as used.
   */
  const retryFile = (id: string, constraints: FormFileUploadConstraints) => {
    const fileToRetry = getClientFiles().find((file) => file.id === id)
    if (
      !fileToRetry ||
      fileToRetry.status.type !== FormFileUploadStatusEnum.UploadError ||
      !fileToRetry.status.canRetry
    ) {
      return null
    }

    const newFiles = getFileInfoForNewFiles([fileToRetry.file], constraints)
    updateClientFiles([...getClientFiles().filter((file) => file.id !== id), ...newFiles])

    return newFiles[0].id
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const downloadFile = async (id: string) => {
    try {
      const response = await formsApi.filesControllerDownloadToken(id, {
        accessToken: 'onlyAuthenticated',
      })
      const { jwt } = response.data
      window.open(`${environment.formsUrl}/files/download/file/${jwt}`, '_blank')
    } catch (error) {
      // TODO handle error
    }
  }

  /**
   *
   * @param ids
   */
  const refetchAfterImportIfNeeded = async (ids: string[]) => {
    if (ids.length === 0) {
      return
    }

    const fileNotInServerFiles =
      !serverFilesQuery.data || ids.some((id) => !serverFilesQuery.data?.[id])
    if (!serverFilesQuery.isFetched || fileNotInServerFiles) {
      await serverFilesQuery.refetch()
    }
  }

  const mergedFiles = useMemo(() => {
    const serverFiles = serverFilesQuery.data ?? []

    return mergeClientAndServerFiles(clientFiles, serverFiles)
  }, [clientFiles, serverFilesQuery.data])

  const getFileInfoById = useCallback(
    (fileId: string) => {
      const file = mergedFiles[fileId]

      if (!file) {
        return {
          status: serverFilesQuery.isFetched
            ? // The special case when the file is stored in the form data, but not in client nor server files, it can happen
              // when the form concept was saved, but the file upload hasn't finished yet and the user navigates away.
              { type: FormFileUploadStatusEnum.UnknownFile as const }
            : // The special case when info about the file is not available yet, e.g. when the user imports the data and
              // the server files are not fetched yet, or when they are being fetched.
              {
                type: FormFileUploadStatusEnum.UnknownStatus as const,
                offline: serverFilesQuery.fetchStatus === 'paused',
              },
          fileName: fileId,
          canDownload: false,
          fileSize: null,
        } satisfies FormFileUploadFileInfo
      }

      return file
    },
    [mergedFiles, serverFilesQuery.isFetched, serverFilesQuery.fetchStatus],
  )

  // Cleanup
  useEffect(() => {
    return () => {
      clientFilesRef.current.forEach((file) => {
        if (file.status.type === FormFileUploadStatusEnum.Uploading) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          abortControllersRef.current[file.id]?.abort()
        }
      })
      // Don't persist the data between page navigations.
      serverFilesQuery.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const context = {
    uploadFiles,
    removeFiles,
    keepFiles,
    retryFile,
    downloadFile,
    refetchAfterImportIfNeeded,
    getFileInfoById,
  }

  return <FormFileUploadContext.Provider value={context}>{children}</FormFileUploadContext.Provider>
}

export const useFormFileUpload = (): FormFileUploadContextType => {
  const context = useContext<FormFileUploadContextType | undefined>(FormFileUploadContext)
  if (!context) {
    throw new Error('useFormFileUpload must be used within a FormFileUploadStateProvider')
  }

  return context
}
