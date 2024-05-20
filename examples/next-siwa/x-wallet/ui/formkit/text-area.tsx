import { cn } from '@/dashboard/lib/utils';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const TextArea = ({ ...props }) => {
  const [inFocus, setInFocus] = useState(false);

  return (
    <div className={cn("xwallet-input xwallet-input-xl" , inFocus ? 'focus' : '',)}>
      <div className="xwallet-label xwallet-label-xl">
        <span className="xwallet-label-text ">{props.label}</span>
      </div>
      <div
        className="xwallet-input-box xwallet-auto-resize-auto-height"
        onFocus={() => setInFocus(true)}
      >
        <TextareaAutosize
          onBlur={() => setInFocus(false)}
          className="xwallet-input-input xwallet-input-textarea xwallet-textarea-auto-resize"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          defaultValue=""
          {...props}
        />
      </div>
    </div>
  );
};

export default TextArea;
