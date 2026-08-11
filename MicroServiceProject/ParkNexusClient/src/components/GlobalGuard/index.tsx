import React from "react";

import {AccountGuard} from "./AccountGuard";

interface IGlobalGuardProps {
    children: React.ReactNode;
}

export function GlobalGuard({children}: IGlobalGuardProps) {
    return <AccountGuard>{children}</AccountGuard>;
}
