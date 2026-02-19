import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-12 text-center">
        <h1 className="text-4xl font-bold text-green-400">
          CyberSatark
        </h1>
        <p className="mt-4 text-lg">
          Phishing Awareness & Detection Platform
        </p>

        <p className="mt-6 max-w-xl mx-auto">
          Learn how to identify phishing emails, SMS scams, and
          fraudulent messages using real examples and interactive tools.
        </p>
      </main>
    </>
  );
}
