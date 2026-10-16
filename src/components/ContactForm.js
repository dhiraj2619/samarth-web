"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetEnquiry, selectEnquiryError, selectEnquiryStatus, submitEnquiry } from "@/store/slices/enquirySlice";

const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const emptyForm = { fullName: "", email: "", mobile: "", city: "", state: "", pincode: "", message: "" };

function validate(form) {
  const errors = {};
  if (form.fullName.trim().length < 2) errors.fullName = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Please enter a valid email address.";
  if (!/^[6-9]\d{9}$/.test(form.mobile)) errors.mobile = "Please enter a valid 10-digit mobile number.";
  if (!form.city.trim()) errors.city = "Please enter your city.";
  if (!form.state) errors.state = "Please select your state.";
  if (!/^[1-9]\d{5}$/.test(form.pincode)) errors.pincode = "Please enter a valid 6-digit pincode.";
  if (form.message.trim().length < 5) errors.message = "Please tell us a little about your requirement.";
  return errors;
}

const inputClass = (hasError) =>
  `mt-2 block w-full rounded-lg border bg-white px-4 py-3 text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
    hasError ? "border-red-400 focus:ring-red-200" : "border-[#e2dfd6] focus:border-brand-500 focus:ring-brand-100"
  }`;

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-[#172938]">
        {label} <span aria-hidden="true" className="text-red-500">*</span>
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function ContactForm() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectEnquiryStatus);
  const submitError = useAppSelector(selectEnquiryError);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => () => { dispatch(resetEnquiry()); }, [dispatch]);

  const update = (name, value) => {
    setForm(current => ({ ...current, [name]: value }));
    if (errors[name]) setErrors(current => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    const { fullName, mobile, ...rest } = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    // Backend's public /enquiries/submit expects `name` and `phone`
    const result = await dispatch(submitEnquiry({ name: fullName, phone: mobile, ...rest }));
    if (submitEnquiry.fulfilled.match(result)) setForm(emptyForm);
  };

  const fieldProps = (name) => ({
    id: name,
    name,
    value: form[name],
    onChange: (event) => update(name, event.target.value),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    className: inputClass(errors[name]),
  });

  if (status === "succeeded") {
    return (
      <div role="status" className="rounded-xl border border-brand-100 bg-white p-8 text-center sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" /></svg>
        </span>
        <h2 className="mt-5 text-xl font-semibold text-brand-800">Thank you for reaching out!</h2>
        <p className="mt-2 text-gray-600">We have received your enquiry and our team will get back to you shortly.</p>
        <button type="button" onClick={() => dispatch(resetEnquiry())} className="mt-6 rounded-lg border border-brand-500 px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50">
          Send another enquiry
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form noValidate onSubmit={handleSubmit} className="rounded-xl border border-[#e2dfd6] bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fullName" label="Full Name" error={errors.fullName}>
          <input type="text" autoComplete="name" placeholder="Your full name" {...fieldProps("fullName")} />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input type="email" autoComplete="email" placeholder="you@example.com" {...fieldProps("email")} />
        </Field>
        <Field id="mobile" label="Mobile" error={errors.mobile}>
          <input
            type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="10-digit mobile number"
            {...fieldProps("mobile")} onChange={(event) => update("mobile", event.target.value.replace(/\D/g, ""))}
          />
        </Field>
        <Field id="city" label="City" error={errors.city}>
          <input type="text" autoComplete="address-level2" placeholder="Your city" {...fieldProps("city")} />
        </Field>
        <Field id="state" label="State" error={errors.state}>
          <select autoComplete="address-level1" {...fieldProps("state")}>
            <option value="">Select state</option>
            {STATES.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </Field>
        <Field id="pincode" label="Pincode" error={errors.pincode}>
          <input
            type="text" inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="6-digit pincode"
            {...fieldProps("pincode")} onChange={(event) => update("pincode", event.target.value.replace(/\D/g, ""))}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id="message" label="Message" error={errors.message}>
            <textarea rows={5} placeholder="Tell us about your requirement" {...fieldProps("message")} />
          </Field>
        </div>
      </div>

      {status === "failed" && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError || "Something went wrong. Please try again."}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-lg bg-brand-700 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-40"
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
