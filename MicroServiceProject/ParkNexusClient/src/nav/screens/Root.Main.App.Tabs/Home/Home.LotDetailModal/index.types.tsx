import GasPumpSvg from '@src/static/svgs/GasPump.svg';
import EngineSvg from '@src/static/svgs/Engine.svg';
import ShoppingCartSvg from '@src/static/svgs/ShoppingCart.svg';
import SprayBottleSvg from '@src/static/svgs/SprayBottle.svg';

import {PARKING_LOT_SERVICE__TYPE_ALIAS} from '@parknexus/api/prisma/client';
import React, {ReactNode} from 'react';

export const LOT_SERVICE_ICONS: Record<PARKING_LOT_SERVICE__TYPE_ALIAS, ReactNode> = {
    CAR_REPAIR: <EngineSvg width={24} height={24} />,
    CAR_WASH: <SprayBottleSvg width={24} height={24} />,
    CHARGING: <GasPumpSvg width={24} height={24} />,
    OIL_CHANGE: <EngineSvg width={24} height={24} />,
    TIRE_REPAIR: <ShoppingCartSvg width={24} height={24} />,
};
