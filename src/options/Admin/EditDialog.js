import React, { useState } from 'react';
import { Dialog, Textarea } from 'evergreen-ui';

function EditDialog({ isShown, onCancel, onSave, initialText }) {
   const [text, setText] = useState(initialText);

   return (
      <Dialog
         title="Редактирование подсказки"
         isShown={isShown}
         onConfirm={(close) => {
            onSave(text);
            close();
         }}
         onCancel={(close) => {
            onCancel();
            close();
         }}
         confirmLabel="Сохранить"
         cancelLabel="Отменить"
      >
         <Textarea
            size={500}
            value={text}
            onChange={(e) => setText(e.target.value)}
         />
      </Dialog>
   );
}

export default EditDialog;
