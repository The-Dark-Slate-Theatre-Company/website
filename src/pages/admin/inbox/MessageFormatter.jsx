import categories from '../../../data/contact-form-categories/ContactFormCategories.json';
import { FormatDate } from './DateFormatter';

// Parses the message to extract key data
export function FormatMessage(x) {

  const uid = x.uid;
  const category = getCategory(x.message.subject);
  const date = FormatDate(x.delivery.startTime.seconds);
  const email = x.replyTo;

  const subject = x.message.subject.substring(x.message.subject.indexOf(']') + 1).trimStart();
  const html = x.message.html;

  const name = html.split('<p><strong><u>New message from ')[1].split('</u>')[0];
  const message = html.split('<p><strong><u>Message:</u></strong></p>')[1].split('<p>')[1].split('</p>')[0];

  return {
    uid,
    name,
    email,
    subject,
    date,
    category,
    message
  }

}


function getCategory(subject) {
  const name = subject.split('[')[1].split(']')[0];
  let category = categories['general'];
  Object.keys(categories).forEach((k) => {
    if(categories[k].name === name) category = categories[k];
  })
  return category;
}