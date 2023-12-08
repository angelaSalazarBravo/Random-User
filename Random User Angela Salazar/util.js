import { Persona } from "./Persona.js";
export function parseDataToPersona(user) {
  const img = user.picture.large;
  const Name = user.name.first + " " + user.name.last;
  const Mail = user.email;
  const Phone = user.phone;
  const City = user.location.city + ", " + user.location.state;

  return new Persona(img, Name, Mail, Phone, City);
}
