import { Building2, Cog, Drama, Newspaper, Spotlight, Theater, UserRound } from "lucide-react";


export function GetContactType(id, iconSize=20) {

  switch (id) {

    case 'individual':
      return {
        name: 'Individual',
        description: 'This contact is an individual',
        colour: '#95a5a6',
        icon: <UserRound size={iconSize} />
      }

    case 'organisation':
      return {
        name: 'Organisation',
        description: 'This contact is a non-theatre organisation',
        colour: '#95a5a6',
        icon: <Building2 size={iconSize} />
      }

    case 'theatre': 
      return {
        name: 'Theatre Group',
        description: 'This contact is a theatre or touring company, or a community theatre group',
        colour: '#1abc9c',
        icon: <Drama size={iconSize} />
      }

    case 'venue':
      return {
        name: 'Performance Venue',
        description: 'This contact is a performing arts venue',
        colour: '#e74c3c',
        icon: <Theater size={iconSize} />
      }

    case 'equipment': 
      return {
        name: 'Equipment & Hires',
        description: 'This contact is an equipment and hires company',
        colour: '#f39c12',
        icon: <Spotlight size={iconSize} />
      }

    case 'press':
      return {
        name: 'Press & Media',
        description: 'This contact is a news or media organisation',
        colour: '#9b59b6',
        icon: <Newspaper size={iconSize} />
      }


    default: 
      return {
        name: 'Other',
        description: 'This contact does not fit into the above categories',
        colour: '#777777',
        icon: <div/>
      }

  }

}



export function GetAllContactTypes(size) {
  const keys = ['individual', 'organisation', 'theatre', 'venue', 'equipment', 'press', 'other'];

  const types = keys.map((k) => {
    const type = GetContactType(k, size);
    return {uid: k, ...type}
  });

  return types;
}