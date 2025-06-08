import Config from "./chainConfig.json";

const anvilConfig = Config[31337];
const sepoliaConfig = Config[11155111];
let chainConfig = sepoliaConfig;

export { anvilConfig, sepoliaConfig, chainConfig, Config };
