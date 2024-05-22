import { cn } from "@/dashboard/lib/utils";
import { CodeBlockHeader } from "./code-block-header";
import styles from "./code-block.module.css";
import { themes, Highlight } from "prism-react-renderer";
import { useTheme } from "next-themes";

export const CodeBlock = ({
  children,
  fileLocation,
  code,
}: {
  children: any;
  fileLocation: string;
  code: string;
}) => {
  const { theme } = useTheme();
  const getTheme = () => {
    return theme === "dark" ? themes.vsDark : themes.vsLight;
  };

  return (
    <div className={cn(styles.codeBlock_root, styles.codeBlock_wrapper)}>
      <CodeBlockHeader fileLocation={fileLocation} code={code} />
      <Highlight
        code={children.trim()}
        language="javascript"
        theme={getTheme()}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={cn(className, styles.codeBlock_pre)} style={style}>
            <code className={styles.codeBlock_code}>
              {tokens.map((line, i) => (
                <div
                  {...getLineProps({ line, key: i })}
                  key={i}
                  className={styles.line}
                >
                  <div className={styles.tokenLine}>
                    {line.map((token, key) => (
                      <span
                        key={key}
                        {...getTokenProps({ token, key })}
                        className={cn(token.types.map((type) => styles[type]))}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
};
