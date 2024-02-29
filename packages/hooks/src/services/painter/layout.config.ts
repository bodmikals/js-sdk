import { layoutInfo, posterLayoutConfig } from "./basePaint";

export const defaultLayoutConfig: posterLayoutConfig = {
  domain: {
    fontSize: 13,
    // color: undefined,
    position: {
      left: 20,
      bottom: 37,
    },
  },
  message: {
    fontSize: 20,
    color: "white",
    textBaseline: "top",
    position: {
      left: 20,
      top: 16,
    },
  },
  position: {
    fontSize: 20,
    color: "white",
    position: {
      left: 20,
      top: 70,
    },
  },
  unrealizedPnl: {
    fontSize: 36,
    color: "rgba(255,255,255,0.5)",
    position: {
      left: 20,
      top: 110,
    },
  },
  informations: {
    fontSize: 12,
    color: "rgba(255,255,255,0.54)",
    position: {
      left: 20,
      top: 150,
    },
  },

  updateTime: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    textAlign: "end",
    position: {
      right: 15,
      bottom: 15,
    },
  },
};
