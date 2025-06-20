import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { postSendComposedEmail } from '../services/api'; // Updated to use postSendComposedEmail
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'; // Import icon

const EmailComposeForm = ({ selectedEmailData, onEmailSent, onClearSelection }) => {
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });

  const initialValues = {
    to: selectedEmailData?.companyEmail || '',
    companyName: selectedEmailData?.companyName || '',
    subject: selectedEmailData?.subjectLine || '',
    body: selectedEmailData?.bodyContent || '',
    attachments: selectedEmailData?.filePath || '',
  };

  const validationSchema = Yup.object({
    to: Yup.string().email('Invalid email address').required('Recipient email is required'),
    subject: Yup.string().required('Subject is required'),
    body: Yup.string().required('Body is required'),
    attachments: Yup.string(),
  });

  useEffect(() => {
    if (selectedEmailData) {
      setFormStatus({ message: '', type: '' });
    }
  }, [selectedEmailData]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setFormStatus({ message: '', type: '' });
    try {
      const apiPayload = {
        recipientEmail: values.to,
        subject: values.subject,
        body: values.body,
        attachmentPath: values.attachments,
        originalEmailId: selectedEmailData?.id
      };
      const response = await postSendComposedEmail(apiPayload); // Use actual API function
      setFormStatus({ message: response.message, type: 'success' });
      if (onEmailSent) {
        onEmailSent(selectedEmailData?.id, 'Sent'); // Assuming 'Sent' is the new status
      }
    } catch (error) {
      setFormStatus({ message: error.message || 'Failed to send email.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedEmailData) {
    return (
      <div className="p-6 bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl border border-slate-700 mt-6 min-h-[200px] flex items-center justify-center">
        <p className="text-center text-slate-400">Select an email from the table above to compose.</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl border border-slate-700 mt-6">
      <h2 className="text-2xl font-semibold text-sky-300 mb-6">Compose Email for: <span className="text-sky-100">{selectedEmailData.companyName}</span></h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form className="space-y-5">
            <div><label htmlFor="to" className="block text-sm font-medium text-sky-200">To (Company Email)</label><Field type="email" name="to" id="to" readOnly className="mt-1 block w-full px-4 py-2.5 bg-slate-700/30 border border-slate-600 rounded-lg shadow-sm sm:text-sm text-gray-300 cursor-not-allowed" /><ErrorMessage name="to" component="div" className="text-red-400 text-xs mt-1.5" /></div>
            <div><label htmlFor="subject" className="block text-sm font-medium text-sky-200">Subject</label><Field type="text" name="subject" id="subject" className="mt-1 block w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-gray-50" /><ErrorMessage name="subject" component="div" className="text-red-400 text-xs mt-1.5" /></div>
            <div><label htmlFor="body" className="block text-sm font-medium text-sky-200">Body</label><Field as="textarea" name="body" id="body" rows="6" className="mt-1 block w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-gray-50" /><ErrorMessage name="body" component="div" className="text-red-400 text-xs mt-1.5" /></div>
            <div><label htmlFor="attachments" className="block text-sm font-medium text-sky-200">Attachment Path</label><Field type="text" name="attachments" id="attachments" className="mt-1 block w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-gray-50" /><ErrorMessage name="attachments" component="div" className="text-red-400 text-xs mt-1.5" /></div>

            {formStatus.message && (<div className={`p-3 rounded-md text-sm ${formStatus.type === 'success' ? 'bg-green-700/50 text-green-300' : 'bg-red-700/50 text-red-300'}`}>{formStatus.message}</div>)}

            <div className="pt-2 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              {onClearSelection && (<button type="button" onClick={onClearSelection} className="py-2 px-4 border border-slate-600 rounded-lg shadow-sm text-sm font-medium text-sky-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors">Deselect</button>)}
              <button type="submit" disabled={isSubmitting || !dirty || !isValid} className="py-2.5 px-5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                <PaperAirplaneIcon className={`h-5 w-5 mr-2 ${isSubmitting ? 'animate-ping' : ''}`} />
                {isSubmitting ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default EmailComposeForm;
