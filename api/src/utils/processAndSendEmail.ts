import * as Eta from "https://deno.land/x/eta@v1.12.3/mod.ts";
import { sendEmail } from "../email/index.ts";
import { createCode } from "./codeManagement.ts";

export async function processAndSendEmail(templateFileName: string, email: string, from: string, hostUrl: string, subject: string) {
  const code = await createCode(email);
  let template = await Deno.readTextFile(templateFileName);
  const templateFunction = Eta.compile(template);

  try {
    template = templateFunction(
      { hostUrl, email, code },
      Eta.config
    );
  } catch (e) {
    console.log("***** template", e);
    throw e;
  }

  try {
    await sendEmail({
      subject,
      message: template || "",
      to: email,
      from,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}