import {
  BestSeller,
  Hero,
  LatestCollection,
  Newsletter,
  OurPolicy,
} from "../components";

const Home = () => {
  return (
    <>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <Newsletter percent={20} />
    </>
  );
};

export default Home;
