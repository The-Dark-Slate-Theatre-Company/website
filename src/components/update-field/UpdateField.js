

export function updateField(field, value, setValue, setEdited=null) {
  setValue((prev) => ({
    ...prev,
    [field]: value
  }));
  if(setEdited) setEdited(true);
}


export function updateNestedField(parent, field, value, setValue, setEdited=null) {
  setValue((prev) => ({
    ...prev,
    [parent]: {
      ...prev[parent],
      [field]: value,
    },
  }));
  if(setEdited) setEdited(true);
}


export function updateListItem(parent, uid, field, value, setValue, setEdited=null) {
  setValue((prev) => (
    {
      ...prev,
      [parent]: prev[parent].map((item) => 
        item.uid === uid 
        ? { ...item, [field]: value }
        : item
      )
    }
  ));
  if(setEdited) setEdited(true);
}


export function updateNestedListItem(grandparentField, grandparentUid, parentField, parentUid, field, value, setValue, setEdited=null) {
  setValue((prev) => (
    {
      ...prev,
      [grandparentField]: prev[grandparentField].map((grandparent) => 
        grandparent.uid === grandparentUid 
        ? { 
            ...grandparent,
            [parentField]: grandparent[parentField].map((parent) => 
              parent.uid === parentUid 
              ? { ...parent, [field]: value }
              : parent
            )
          }
        : grandparent
      )
  }));
  if(setEdited) setEdited(true);
}


export function updateListItemInNestedField(grandparentField, parentField, uid, field, value, setValue, setEdited=null) {
  setValue((prev) => (
    {
      ...prev,
      [grandparentField]: {
        ...prev[grandparentField],
        [parentField]: prev[grandparentField][parentField].map((item => 
          item.uid === uid 
          ? {...item, [field]: value}
          : item
        ))
      }
    }
  ));
  if(setEdited) setEdited(true);
}


export function addListItem(field, item, setValue, setEdited=null, addToStart=false) {
  if(addToStart) {
    setValue((prev) => (
      {
        ...prev,
        [field]: [item, ...prev[field]]
      }
    ));
  }
  else {
    setValue((prev) => (
      {
        ...prev,
        [field]: [...prev[field], item]
      }
    ));
  }
  if(setEdited) setEdited(true);
}


export function addNestedListItem(parent, parentUid, field, item, setValue, setEdited=null) {

  setValue((prev) => ({
    ...prev,
    [parent]: prev[parent].map((parentItem) => 
      parentItem.uid === parentUid 
      ? { ...parentItem, [field]: [...parentItem[field], item] }
      : parentItem
    )
  }));
  if(setEdited) setEdited(true);
}


export function addListItemToNestedField(parent, field, item, setValue, setEdited=null) {
  setValue((prev) => (
    {
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: [...prev[parent][field], item]
      }
    }
  ));
  if(setEdited) setEdited(true);
}


export function deleteListItem(field, uid, setValue, setEdited=null) {
  setValue((prev) => (
    {
      ...prev,
      [field]: prev[field].filter((x) => x.uid !== uid)
    }
  ));
  if(setEdited) setEdited(true);
}


export function deleteNestedListItem(parentField, parentUid, field, uid, setValue, setEdited=null) {
  setValue((prev) => (
    {
      ...prev,
      [parentField]: prev[parentField].map((parent) => 
        parent.uid === parentUid
        ? { ...parent, [field]: parent[field].filter((x) => x.uid !== uid) }
        : parent
      )
    }
  ));
  if(setEdited) setEdited(true);
}


export function deleteListItemInNestedField(parentField, field, uid, setValue, setEdited=null) {
  setValue((prev) => (
    {
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: prev[parentField][field].filter((x) => x.uid !== uid)
      }
    }
  ));
  if(setEdited) setEdited(true);
}