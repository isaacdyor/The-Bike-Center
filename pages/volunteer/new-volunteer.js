import React from "react";
import Link from 'next/link'
import {useSession} from "next-auth/react";

const Volunteer = () => {
  const { data: session, status } = useSession();
  return(
    <div>
      <h1>Successfully signed up as a volunteer</h1>
      <p>When someone requests you to pick up a bike for them an email will be sent to the email address you logged in with.
      You can also find a list of all of your assignments on the <Link href={`/volunteer/${session?.user?.id}`}><a>Volunteer</a></Link> page.
      Once you have completed a donation you submit it at the <Link href='/donation/'><a>Donation</a></Link> page.</p>

    </div>
  )
}

export default Volunteer;

