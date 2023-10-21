import { ChangeEvent } from 'react';

import { DocumentContent } from '../types';

type Props = {
  content: DocumentContent;
  onChange: (content: DocumentContent) => void;
};

const DocumentBuilder = (props: Props) => {
  const { content, onChange } = props;

  const changeFile = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...content, source: target.value });
  };

  return (
    <div className="rounded-lg border p-4 shadow-lg">
      <label htmlFor="title" className="mb-2 block font-bold text-gray-700">
        Title:
        <input
          value={content.title}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            onChange({ ...content, title: target.value })
          }
          type="text"
          id="title"
          className="mt-2 w-full rounded-lg border px-3 py-2"
        />
      </label>
      <label htmlFor="file" className="mb-2 block font-bold text-gray-700">
        File URL:
        <input
          value={content.source}
          onChange={changeFile}
          type="text"
          id="file"
          className="mt-2 w-full rounded-lg border px-3 py-2"
        />
      </label>
      <label htmlFor="description" className="mb-2 block font-bold text-gray-700">
        Description:
        <input
          value={content.description}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            onChange({ ...content, description: target.value })
          }
          type="text"
          id="description"
          className="mt-2 w-full rounded-lg border px-3 py-2"
        />
      </label>
    </div>
  );
};

export default DocumentBuilder;
