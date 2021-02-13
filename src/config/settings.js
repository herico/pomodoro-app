import Storage from "../utils/storage";
import { storageAvailable } from "../utils";

const initialParameters = Object.freeze({
  colors: [
      {
        name: 'violet',
        isActive: true,
        hexCode: "#da7ffc"
      },
      {
        name: 'blue',
        isActive: false,
        hexCode: "#73f0f7"
      },
      {
        name: 'orange',
        isActive: false,
        hexCode: "#f66d6d"
      }
    ],
    fonts: [
      {
        name: 'Montserrat',
        isActive: true,
        className: 'montserrat'
      },
      {
        name: 'Poppins',
        isActive: false,
        className: 'poppins'
      },
      {
        name: 'Fira Sans',
        isActive: false,
        className: 'fira-sans'
      }
    ],
    timeLimits: [
     {
        name: 'pomodoro',
        title: 'pomodoro',
        value: 25
      },
     {
        name: 'shortBreak',
        title: 'short break',
        value: 5
      },
      {
        name: 'longBreak',
        title: 'long break',
        value: 15
      },
    ]
});

export function getInitialState() {
  if (storageAvailable) {
    const storage = new Storage('localStorage');
    return Object.freeze({
        timeLimits: storage.getItem('timeLimits') || [ ...initialParameters.timeLimits ],
        colors: storage.getItem('colors') || [ ...initialParameters.colors ],
        fonts: storage.getItem('fonts') || [ ...initialParameters.fonts ]
    })
  }

  return { ...initialParameters };
}