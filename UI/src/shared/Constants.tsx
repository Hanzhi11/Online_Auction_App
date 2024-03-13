export enum ELEMENT_ID {
    SIGN_IN_BUTTON = 'signInButton',
    NAV_OPEN_BUTTON = 'navOpenButton',
    JOIN_BUTTON = 'joinButton',
    CLOSE_OVERLAY_BUTTON = 'closeOverLayButton',
    HOME_RUNNER = 'homeRunner',
    HEADER = 'header',
    PHOTO_BACK = 'photoBack',
    PHOTO_FORWARD = 'photoForward',
    PHOTO_BAR_BACK = 'photoBarBack',
    PHOTO_BAR_FORWARD = 'photoBarForward',
    COUNTRY_DROP_DOWN = 'countryDropdown',
    SUBJECT_ARROW_UP = 'subjectArrowUp',
    SUBJECT_ARROW_DOWN = 'subjectArrowDown',
}

export enum STATE {
    QLD = 'QLD',
    NSW = 'NSW',
    VIC = 'VIC',
    ACT = 'ACT',
    NT = 'NT',
    TAS = 'TAS',
    SA = 'SA',
}

export enum OVERLAY_CONTENTS {
    NAV = 'nav',
    PHOTOS = 'photos',
}

export interface Option {
    id: string;
    content: string;
}
