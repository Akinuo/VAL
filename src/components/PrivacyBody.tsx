import Link from 'next/link'
import ConsentLink from '@/components/ConsentLink'

const CONTACT = process.env.NEXT_PUBLIC_PRIVACY_EMAIL

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-7 font-display text-lg font-bold tracking-tight text-denim first:mt-0">{children}</h2>
}

/** The full statement text. Shared by the /privacy page and the in-dialog reader. */
export default function PrivacyBody({ modal = false }: { modal?: boolean }) {
  return (
    <>
      <p className="mt-5">
        This statement explains how B.M.O collects, uses, stores and protects your personal data. It is written to
        comply with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong>, its Implementing Rules
        and Regulations, and the issuances of the National Privacy Commission (NPC) of the Philippines.
      </p>

      <H>1. What we collect</H>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li><strong>Account details:</strong> your email address, password (stored hashed by our authentication provider, never in plain text) and the display name you choose.</li>
        <li><strong>Learning records:</strong> which lesson steps and quiz questions you have passed, assessment scores and badges.</li>
        <li><strong>Feedback:</strong> the name (optional), rating and message you send through the feedback form, and your email if you are signed in.</li>
        <li><strong>On-device data:</strong> checklist ticks, guest progress and your cookie choice, saved in your browser&apos;s local storage.</li>
      </ul>
      <p className="mt-2">
        The name you type when you download a certificate is used on your device to produce the PDF. We do not
        collect sensitive personal information as defined by the Act.
      </p>

      <H>2. Why we collect it</H>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>To let you sign in and keep your progress across devices.</li>
        <li>To run lessons, quizzes, the final assessment and certificates for BTLED Home Economics students.</li>
        <li>To read and act on your feedback and improve the lessons.</li>
        <li>To keep the service secure and prevent abuse.</li>
      </ul>
      <p className="mt-2">
        We process personal data on the basis of your <strong>consent</strong> (Section 12(a)) and, for running the
        account you asked for, the <strong>contract or service</strong> you requested. We follow the principles of
        transparency, legitimate purpose and proportionality (Section 11): we collect only what these purposes need.
      </p>

      <H>3. Cookies and similar storage</H>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="py-2 pr-3 font-medium">Type</th>
              <th className="py-2 pr-3 font-medium">Used for</th>
              <th className="py-2 font-medium">Needs consent?</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Sign-in session cookie (Supabase)</td>
              <td className="py-2 pr-3">Keeps you logged in</td>
              <td className="py-2">No, essential</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-3">Local storage</td>
              <td className="py-2 pr-3">Progress, checklists, your cookie choice</td>
              <td className="py-2">No, essential</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">YouTube / Google Drive embeds</td>
              <td className="py-2 pr-3">Playing lesson videos</td>
              <td className="py-2">Yes, loaded only after you allow it</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2">
        We do not use advertising or analytics cookies. You can change your choice at any time
        {modal ? ' from the Cookie settings link in the footer or in Settings.' : <>: <ConsentLink className="font-medium text-denim" />.</>}
      </p>

      <H>4. Who receives your data</H>
      <p className="mt-2">We do not sell your personal data. It is handled only by service providers that run the app for us:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li><strong>Supabase</strong> hosts the database and sign-in.</li>
        <li><strong>Vercel</strong> hosts the website.</li>
        <li><strong>An email service</strong> delivers feedback messages to the course administrators.</li>
        <li><strong>YouTube / Google</strong> serve lesson videos, only if you allow them. Their own privacy policies apply to what they collect.</li>
      </ul>
      <p className="mt-2">
        Some of these providers store data on servers outside the Philippines. We use them under terms that
        require appropriate protection of personal data.
      </p>

      <H>5. How long we keep it</H>
      <p className="mt-2">
        Account and learning records are kept while your account is active and for as long as needed for the
        course. Feedback is kept as long as it is useful for improving the lessons. When you ask us to delete your
        data, we remove it unless the law requires us to keep it.
      </p>

      <H>6. How we protect it</H>
      <p className="mt-2">
        Connections use HTTPS, passwords are hashed, access to the database is limited by row-level security so
        students see only their own records, and administrator access is restricted. No system is perfectly secure.
        If a breach affecting your data occurs, we will notify you and the NPC as the law requires.
      </p>

      <H>7. Your rights as a data subject</H>
      <p className="mt-2">Under Section 16 of the Act, you have the right to:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>be informed about how your data is processed;</li>
        <li>object to processing, and withdraw your consent;</li>
        <li>access the personal data we hold about you;</li>
        <li>correct inaccurate or outdated data;</li>
        <li>request suspension, blocking, removal or destruction of your data;</li>
        <li>data portability, receiving your data in a commonly used format;</li>
        <li>claim compensation for damages caused by inaccurate, incomplete, unauthorised or unlawfully obtained data.</li>
      </ul>
      <p className="mt-2">
        You can change your display name and log out under{' '}
        {modal ? 'Settings' : <Link href="/settings" className="font-medium text-denim underline underline-offset-2">Settings</Link>}.
        To use any other right,{' '}
        {CONTACT ? (
          <>email <a href={`mailto:${CONTACT}`} className="font-medium text-denim underline underline-offset-2">{CONTACT}</a>.</>
        ) : (
          <>send a message through the feedback form and mark it &ldquo;Privacy request&rdquo;.</>
        )}
      </p>
      <p className="mt-2">
        If you believe your rights have been violated, you may file a complaint with the{' '}
        <a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="font-medium text-denim underline underline-offset-2">
          National Privacy Commission
        </a>.
      </p>

      <H>8. Minors</H>
      <p className="mt-2">
        B.M.O is meant for students of legal age. If you are under 18, please use it only with the permission of a
        parent or guardian.
      </p>

      <H>9. Changes to this statement</H>
      <p className="mt-2">
        If we change how we handle personal data, we will update this page and ask for your consent again where
        the law requires it.
      </p>
    </>
  )
}
