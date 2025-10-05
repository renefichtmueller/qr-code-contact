import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactNotificationRequest {
  firstName: string;
  lastName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName }: ContactNotificationRequest = await req.json();

    console.log("Sending notification for contact:", firstName, lastName);

    const assignee = `${firstName}.${lastName}`;
    const reporter = `${firstName}.${lastName}`;

    const emailContent = `@project = EO
@assignee = ${assignee}
@priority = Major
@dueDate = 13-Jan-2017
@dueDateFormat = dd-MMM-yyyy
@reporter = ${reporter}`;

    const emailResponse = await resend.emails.send({
      from: "Contact Scanner <onboarding@resend.dev>",
      to: ["issue@flexoptix.net"],
      subject: "Neuer Kontakt erstellt",
      text: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
