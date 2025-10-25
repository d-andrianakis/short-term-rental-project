import { useTranslations } from 'next-intl';

export default function PaymentSuccess() {
  const g = useTranslations("Checkout");

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">{g('thank_you')}</h1>
        <h2 className="text-2xl">{g('booking_complete')}</h2>
      </div>
    </main>
  );
}