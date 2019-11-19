import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function EditableItem(props) {
   const { onSave, initialText, Template } = props;
   const fieldRef = useRef();
   const [isEditing, setIsEditing] = useState(false);
   const [text, setText] = useState(initialText);

   const beginEdit = useCallback(() => {
      setIsEditing(true);
   }, []);

   const endEdit = useCallback(
      (save = true) => {
         if (save) {
            onSave(text);
         } else {
            setText(initialText);
         }
         setIsEditing(false);
      },
      [initialText, onSave, text],
   );

   const onKeyDown = useCallback(
      (event) => {
         switch (event.key) {
            case 'Enter':
               endEdit();
               break;
            case 'Escape':
               endEdit(false);
               break;
         }
      },
      [endEdit],
   );

   useEffect(() => {
      if (isEditing) {
         fieldRef.current.focus();
      }
   }, [isEditing]);

   return (
      <>
         {isEditing ? (
            <input
               value={text}
               onChange={(event) => setText(event.target.value)}
               onKeyDown={onKeyDown}
               onBlur={endEdit}
               ref={fieldRef}
            />
         ) : (
            <Template onClick={beginEdit} text={text} {...props} />
         )}
      </>
   );
}

EditableItem.propTypes = {
   Template: PropTypes.func.isRequired,
   initialText: PropTypes.string.isRequired,
   onSave: PropTypes.func.isRequired,
};

export default EditableItem;
