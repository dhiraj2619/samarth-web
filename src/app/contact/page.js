import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us | Samarth Enterprises",
  description: "Get in touch with Samarth Enterprises for product enquiries and bulk requirements.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar activeLink="Contact Us" />
      <main className="flex-1 bg-[#f8f7f2] py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span aria-hidden="true" className="mb-4 block h-1 w-12 rounded-full bg-brand-500" />
          <h1 className="text-2xl font-bold tracking-tight text-[#10212e] sm:text-3xl lg:text-4xl">Contact Us</h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Share your details and requirement — our team will get back to you shortly.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </main>
    </>
  );
}
