// https://oss.woo.network/static/network_logo/1.png
// network logo
import { cn } from "@/utils/css";
// import { cva } from "class-variance-authority";
import React, { FC, useEffect, useMemo } from "react";
import { Size } from "./types";

export type NetworkImageType = "symbol" | "chain" | "token" | "placeholder";

export interface NetworkImageProps {
  name?: string;
  id?: number;
  size?: Size | number;
  backgroundColor?: string;
  className?: string;
  rounded?: boolean;
  type: NetworkImageType;

  symbol?: string;
}

// TODO: 添加icon生成adpater
export const NetworkImage: FC<NetworkImageProps> = (props) => {
  const [url, setUrl] = React.useState<string>();

  useEffect(() => {
    if (
      typeof props.type === "undefined" &&
      typeof props.symbol === "undefined"
    ) {
      throw new Error("NetworkImage must have a type or symbol");
    }

    if (props.type === "placeholder") {
      return;
    }

    const img = new Image();

    img.onload = function () {
      setUrl(img.src);
    };

    img.onerror = function () {
      console.log("load icon error");
    };

    if (props.type === "token") {
    }

    if (props.type === "symbol" || props.type === "token") {
      let name = props.name;
      if (typeof props.symbol === "string") {
        const arr = props.symbol?.split("_");
        name = arr[1];
      }
      // coin logos
      img.src = `https://oss.woo.network/static/symbol_logo/${name!.toUpperCase()}.png`;
    }
    if (props.type === "chain") {
      img.src = `https://oss.woo.network/static/network_logo/${props.id}.png`;
    }

    // crypto logos
    // https://cryptologos.cc/logos/
    // img.src = `https://cryptologos.cc/logos/${props.name.toLowerCase()}-${props.size}.png?v=010`;
  }, [props.type, props.symbol, props.name]);

  const icon = useMemo(() => {
    if (!url) {
      return null;
    }
    return <img src={url} alt={props.name} />;
  }, [url]);

  const size = useMemo(() => {
    if (typeof props.size === "undefined") return "24px";
    if (props.size === "small") return "16px";
    if (props.size === "medium") return "24px";
    if (props.size === "large") return "32px";

    return `${props.size}px`;
  }, [props.size]);

  return (
    <div
      className={cn(
        "inline-block",
        props.type === "placeholder" && "bg-slate-200",
        props.rounded && "rounded-full",
        props.className
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: props.backgroundColor,
      }}
    >
      {icon}
    </div>
  );
};
NetworkImage.displayName = "NetworkImage";
