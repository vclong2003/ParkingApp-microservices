import React from "react";
import {LotDetailModal} from "./Home.LotDetailModal";
import {HomeContext} from "./index.$context";
import {Map} from "./Home.Map";

export function Home() {
    return (
        <HomeContext>
            <Map />
            <LotDetailModal />
        </HomeContext>
    );
}
