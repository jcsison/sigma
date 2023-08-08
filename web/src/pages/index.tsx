import Head from "next/head";
import dynamic from "next/dynamic.js";

const DynamicRecordComponentWithNoSSR = dynamic(
  () => import("~/components/RecordComponent"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Sigma</title>
        <meta name="description" content="Sigma!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DynamicRecordComponentWithNoSSR />
    </>
  );
}
