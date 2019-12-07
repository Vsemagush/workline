import React, { useState } from 'react';
import { Text, TextInput, Icon } from 'evergreen-ui'



function EditingItem(props) {
  const [text, setText] = useState(props.newup);
  const [edit, setEdit] = useState(false);




  if (edit == true) {
    return (
      <div>
        <TextInput value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(e) => {
          switch (e.key) {
            case 'Enter':
              setEdit(false);
              props.onSave(text);
              break;
            case 'Escape':
              setText(props.newup);
              setEdit(false);
              break;
          }
        }} />
      </div>
    );
  }
  else {
    return (
      <Text onClick={() => setEdit(true)}>
        {text}</Text>

    );
  }
}
export default EditingItem;
