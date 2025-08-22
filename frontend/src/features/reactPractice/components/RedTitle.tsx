// RedTitleというReactコンポーネントの定義
// Props ← Properties（プロパティーズ）の略
type RedTitleProps = {
  text: string;
};

export const RedTitle = (props: RedTitleProps) => {
  return (
    <h1 className="bg-red-400 text-center font-bold text-xl">{props.text}</h1>
  );
};
