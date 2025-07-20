import styles from "./title.module.css";

interface TitleProps {
  children: React.ReactNode;
}

export default function Title({ children }: TitleProps) {
  return (
    <div className={styles.container}>
      <h2>{children}</h2>
    </div>
  );
}
