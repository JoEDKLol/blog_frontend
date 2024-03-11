import PriHeader from "./Header";
import PriMainContent from "./Main";

const priLayoutIndex = ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <PriHeader></PriHeader>
      <PriMainContent>{children}</PriMainContent>
      {/* 최초실행되는 페이지입니다. */}
      {/* <MainContent>{children}</MainContent> */}
    </>)
};

export default priLayoutIndex;