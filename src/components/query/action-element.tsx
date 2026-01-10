import { ActionProps } from "react-querybuilder";
import { Button } from "../ui/button";
import { IconTrash } from "@tabler/icons-react";

export default function RemoveActionElement(props: ActionProps) {
  return (
    <Button
      variant="ghost-destructive"
      type="button"
      data-testid={props.testID}
      disabled={props.disabled && !props.disabledTranslation}
      className={props.className}
      title={
        props.disabledTranslation && props.disabled
          ? props.disabledTranslation.title
          : props.title
      }
      onClick={props.handleOnClick}
    >
      <IconTrash />
    </Button>
  );
}
