import { useUIContext } from '@bratislava/common-frontend-ui-context';
import cx from 'classnames';

enum Enum_Pagecategory_Color {
  Blue = 'blue',
  Brown = 'brown',
  Green = 'green',
  Purple = 'purple',
  Red = 'red',
  Yellow = 'yellow',
}

export interface SubpageListProps {
  className?: string;
  subpageList?: { title?: string; url?: string; anchor?: string }[];
  pageColor?: Enum_Pagecategory_Color;
}

export const SubpageList = ({
  className,
  subpageList,
  pageColor,
}: SubpageListProps) => {
  const { Link: UILink } = useUIContext();
  return (
    <div
      className={cx(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-32 mb-16 mt-10',
        className
      )}
    >
      {subpageList?.map((subpage, index) => (
        <div key={index}>
          <UILink href={subpage.url ? `/${subpage.url}` : `#${subpage.anchor}`}>
            <div className="group inline-flex flex-row items-center sm:items-start sm:flex-col sm:space-y-5 cursor-pointer">
              <div className="rounded-full text-lg flex items-center justify-center font-semibold bg-primary w-12 h-12 sm:w-16 sm:h-16 text-white">
                {index + 1}
              </div>
              <span className="group-hover:underline not-italic font-medium leading-6 tracking-wide text-default ml-8 sm:ml-0">
                {subpage.title}
              </span>
            </div>
          </UILink>
        </div>
      ))}
    </div>
  );
};

export default SubpageList;