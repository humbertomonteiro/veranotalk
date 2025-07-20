import styles from "./mainButton.module.css";

interface ButtonProps {
  data: DataButton;
}

interface DataButton {
  type: "link" | "button";
  link?: string;
  text: string;
  method?: () => void;
  color: "white" | "black" | "gold";
  small?: boolean;
}

export default function MainButton({ data, ...args }: ButtonProps) {
  return (
    <>
      {data.type === "link" ? (
        <a
          href={data.link}
          className={styles.button}
          {...args}
          data-color={data.color}
          data-button-small={data.small}
        >
          {data.text}
        </a>
      ) : (
        <button
          onClick={data.method}
          className={styles.button}
          {...args}
          data-color={data.color}
          data-button-small={data.small}
        >
          {data.text}
        </button>
      )}
    </>
  );
}
