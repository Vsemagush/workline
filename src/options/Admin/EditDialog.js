import React, { useState } from 'react';
import { Dialog, Textarea } from 'evergreen-ui';

function EditDialog(props) {
    const [text, setText] = useState(props.text);
    return (
        <Dialog title="Редактирование подсказки"
            isShown={true}
            onConfirm={
                (close) => {
                    props.onConfirm(text);
                    close();
                }
            }
            onCancel={
                (close) => {
                    setText(props.text);
                    close();
                }}
            onCloseComplete={props.onCloseComplete}
            confirmLabel="Сохранить"
            cancelLabel="Отмена"
        >
            <Textarea
                value={text}
                onChange={(event) => { setText(event.target.value) }} >
            </Textarea>
        </Dialog>
    );
}

export default EditDialog;