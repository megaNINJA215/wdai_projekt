import { Blobatar } from "@blobatar/react"; import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/waves.json' with { type: 'json' };
import { useMemo } from "react";


export interface ProfilePictureProps {
  type: "user" | "community";
  name: string;
  size?: number;
  style?: string;
}

// ze względu że stronę hostuję na vercelu a nie prywatnym serwerze nie mam jak przechowywać plików
// a w bazie danych ze względu na darmowy plan mam ograniczną ilość miejsca, więc póki co nie implementuję
// możliwości przechowywania w nim jakichkolwiek plików, a gdy będzie taka potrzeba to będę z tego korzystać
// bardzo oszczędnie, więc nie wszędzie będę z tego korzystać
//
// w tym celu wykorzystuję zewnętrzne biblioteki blobatar oraz dicebear
// w blobatar podobaja mi się avatary dla użytkowników, ale nie pasują mi one do społeczności, więc dla społeczności wykorzystuję dicebear

export default function ProfilePicture(props: ProfilePictureProps) {

  if (props.type == "user") {
    return (
      <Blobatar name={props.name} size={props.size} background="circle" tone={0.5} className={props.style} />
    );

  } else if (props.type == "community") {
    const style = new Style(definition);
    const avatar = useMemo(() => {
      return new Avatar(style, {
        seed: props.name,
        size: props.size || 32,
        "borderRadius": 50,
        "idRandomization": true,
      }).toDataUri();
    }, [props.name]);

    return <img src={avatar} alt="Avatar" className={props.style} />;
  }
};