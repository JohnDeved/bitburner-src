export type ServerName = string;
export type IPAddress = string & {
    __type: "IPAddress";
};
export declare function isIPAddress(value: string): value is IPAddress;
