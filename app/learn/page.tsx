import Navbar from "@/components/Navbar";

export default function Learn() {
  return (
    <>
      <Navbar />
      <div className="p-10 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          What is Phishing?
        </h1>

        <p>
          Phishing is a cyberattack where attackers trick users into
          revealing sensitive information such as passwords, OTPs,
          or banking details through fake emails, SMS, or websites.
        </p>

        <h2 className="mt-6 font-semibold">
          Common Phishing Signs
        </h2>

        <ul className="list-disc ml-6 mt-2">
          <li>Urgent language</li>
          <li>Unknown sender</li>
          <li>Suspicious links</li>
          <li>Requests for credentials</li>
          <li>Threats or warnings</li>
        </ul>
      </div>
    </>
  );
}
