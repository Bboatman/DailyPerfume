
import {
    IonContent,
    IonInput,
    IonItem,
    IonList,
    IonPopover
} from '@ionic/react';
import { useState } from 'react';


interface InputProps {
    valueGetter: any,
    valueSetter: React.Dispatch<any>,
    staticComparator?: any,
    suggestionArray: any[],
}

const TextInputWithSuggestion: React.FC<InputProps> = (props) => {
    const [isDirty, setIsDirty] = useState<boolean>(false);

    return (
        <div style={{ flex: 1, width: "100%" }}>
            <IonInput
                id="house-input"
                value={props.valueGetter}
                inputMode={"text"}
                onIonChange={e => {
                    props.valueSetter(e.detail.value!);
                    if (e.detail.value !== props.staticComparator || !props.staticComparator) {
                        setIsDirty(true);
                    }
                }}>
            </IonInput>
            <IonPopover
                trigger="house-input"
                triggerAction='context-menu'
                side="bottom"
                alignment="start"
                size='cover'
                showBackdrop={false}
                keyboardClose={false}
                dismissOnSelect={true}
                isOpen={props.valueGetter !== undefined && props.valueGetter !== null && props.valueGetter?.length > 0 && props.suggestionArray.length > 0 && isDirty}
                arrow={false}>
                <IonContent>
                    <IonList>
                        {props.suggestionArray.map((elem, index) =>
                        (<IonItem onClick={() => {
                            props.valueSetter(elem)
                        }} key={"perfume" + index}>{elem}</IonItem>)
                        )}
                    </IonList>
                </IonContent>
            </IonPopover>
        </div>
    )
};

export default TextInputWithSuggestion