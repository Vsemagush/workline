import React, { useState, useCallback } from 'react';
import { TextInput, Table } from 'evergreen-ui';
/*
Редактирование может находиться в 2 состояниях: редактирование запущено и редактирование не запущено.
Если редактирование не запущено, то рисуется пользовательский компонент с двумя перебитыми опциями:
1) text - чтобы синхронизировать его с редактированием.
2) onClick - чтобы запускать редактирование по клику.

Если редактирование запущено, то рисуется обычный input, который полностью контролируется редактированием.

Редактирование завершается в трёх случаях:
1) Нажатие Escape
2) Уход фокуса из поля ввода
3) Нажатие Enter

Если нажали Escape, то сохранение не происходит и текст сбрасывается на initialText.
В остальных случаях дёргается коллбек, переданный в onSave.
 */

function EditableItem(props) {
   const { onSave, initialText, marginLeft } = props;
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

   const fieldRef = useCallback(
      (node) => {
         if (isEditing && node) {
            node.focus();
         }
      },
      [isEditing],
   );

   return (
      <>
         {isEditing ? (
            <Table.Cell display="flex">
               <TextInput
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  onKeyDown={onKeyDown}
                  onBlur={endEdit}
                  innerRef={fieldRef}
               />
            </Table.Cell>
         ) : (
            <Table.TextCell
               display="flex"
               onClick={beginEdit}
               isSelectable={true}
               marginLeft={marginLeft}
            >
               {text}
            </Table.TextCell>
         )}
      </>
   );
}

export default EditableItem;
