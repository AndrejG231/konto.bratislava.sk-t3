import { ChangeEvent } from 'react';

import { TitleContent } from '../types';

type Props = {
  content: TitleContent;
  onChange: (content: TitleContent) => void;
};

const TitleBuilder = (props: Props) => {
  const { content, onChange } = props;

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
    </div>
  );
};

export default TitleBuilder;
