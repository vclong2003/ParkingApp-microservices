import React from "react";
import {BottomSheetBackdropProps, BottomSheetBackdrop as GHBottomSheetBackdrop} from "@gorhom/bottom-sheet";

export function BottomSheetBackdrop(props: BottomSheetBackdropProps) {
    return <GHBottomSheetBackdrop {...props} disappearsOnIndex={-1} />;
}
