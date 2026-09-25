"use client";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { submitContact } from "../../services/apiServices";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;


const Contact1 = () => {
  const [loading, setLoading] = React.useState(false);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();


  const onSubmit = (data) => {
    if (!captchaToken) {
      toast.error("Please verify that you are not a robot.");
      return;
    }
    setLoading(true);

    const payload = {
      name: data.name,
      email: data.email,
      phone_number: data.phone,
      message: data.message,
      recaptcha_token: captchaToken,
    };

    submitContact(payload, (response) => {
      setLoading(false);

      if (response.data) {
        toast.success("Thank you! Your message has been submitted successfully.");
        reset();
      } else {
        toast.error("Oops! Something went wrong.");
      }
    });
  };

  return (
    <section
      className=""
      id="contact"
    >

      <div className="cs_gray_bg_1">
        <div className="">
          <div className="row text-start ">

            <div className="col-lg-6 order-lg-2">
              <div className="cs_contact_thumbnail wow fadeInRight">
                <Image
                  src="/assets/img/contact.jpg"
                  alt="Contact"
                  width={650}
                  height={400}
                />
              </div>
            </div>

            <div className="col-lg-6 order-lg-1">
              <div className="cs_height_120 cs_height_lg_10"></div>
              <div className="cs_contact_info_wrapper text-center text-lg-start" >
                <div className="cs_section_heading cs_style_1">
                  <div className="mobile-heading">
                    <h2 className="cs_fs_60 cs_mb_20 wow fadeInUp">
                      We Want to <span className="green-text">Hear from You!</span>
                    </h2>
                  </div>
                  <p
                    className="cs_section_heading_text mb-0 cs_medium text-gray"
                    data-wow-delay="200ms" 
                  >
                    Contact QRTag.it
                  </p>
                  <p
                    className="cs_section_heading_text mb-0 cs_medium text-gray"
                    data-wow-delay="200ms"
                  >
                    Contact Us – Give Feedback
                  </p>
                </div>

                <div className="cs_height_32 cs_height_lg_30"></div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="cs_contact_form row cs_row_gap_30 cs_gap_y_24 "
                  noValidate
                >
                  <div className="col-md-12">
                    <input
                      type="text"
                      placeholder="Name"
                      className={`cs_form_field cs_radius_8 ${errors.name ? "is-invalid" : ""
                        }`}
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                    />
                    {errors.name?.message && (
                      <small className="text-danger">{String(errors.name.message)}</small>
                    )}

                  </div>

                  <div className="col-md-12">
                    <input
                      type="email"
                      placeholder="Email"
                      className={`cs_form_field cs_radius_8 ${errors.email ? "is-invalid" : ""
                        }`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Enter a valid email address",
                        },
                      })}
                    />
                    {errors.email?.message && (
                      <small className="text-danger">{String(errors.email.message)}</small>
                    )}
                  </div>


                  <div className="col-md-12">
                    <input
                      type="text"
                      placeholder="Mobile"
                      className={`cs_form_field cs_radius_8 ${errors.phone ? "is-invalid" : ""
                        }`}
                      {...register("phone", {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Enter a valid 10-digit number",
                        },
                      })}
                    />
                    {errors.phone?.message && (
                      <small className="text-danger">{String(errors.phone.message)}</small>
                    )}
                  </div>

                  <div className="col-md-12">
                    <textarea
                      rows={3}
                      placeholder="Message"
                      className={`cs_form_field cs_radius_8 ${errors.message ? "is-invalid" : ""
                        }`}
                      {...register("message", {
                        required: "Message is required",
                        minLength: {
                          value: 5,
                          message: "Message must be at least 5 characters",
                        },
                      })}
                    ></textarea>
                    {errors.message?.message && (
                      <small className="text-danger">{String(errors.message.message)}</small>
                    )}
                  </div>

                  <div className="col-md-12">
                    <ReCAPTCHA
                      sitekey={SITE_KEY!}
                      onChange={(token) => setCaptchaToken(token)}
                      onExpired={() => setCaptchaToken(null)}
                    />
                  </div>

                  <div className="col-md-12 ">
                    <span className="submit-button">
                      <button
                        type="submit"
                        className="cs_btn cs_style_1 cs_fs_14 text-white cs_semibold text-cap"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                    </span>
                  </div>
                </form>
              </div>
              <div className="cs_height_100 cs_height_lg_80"></div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Contact1;
