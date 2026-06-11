/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "companionName",
      type: "string",
      required: true,
      label: "AI Companion Name",
      minLength: 1,
      maxLength: 50,
    },
    {
      fieldName: "companionTagline",
      type: "string",
      required: false,
      label: "Companion Tagline",
      maxLength: 120,
    },
    {
      fieldName: "companionAvatarUrl",
      type: "url",
      required: false,
      label: "Companion Avatar URL",
    },
    {
      fieldName: "companionPersonality",
      type: "string",
      required: false,
      label: "Companion Personality Description",
      maxLength: 500,
    },
    {
      fieldName: "welcomeMessage",
      type: "string",
      required: false,
      label: "Welcome Message",
      maxLength: 300,
    },
    {
      fieldName: "chatPlaceholder",
      type: "string",
      required: false,
      label: "Chat Input Placeholder",
      maxLength: 100,
    },
    {
      fieldName: "backgroundColor",
      type: "color",
      required: false,
      label: "Background Color",
    },
    {
      fieldName: "surfaceColor",
      type: "color",
      required: false,
      label: "Surface/Card Color",
    },
    {
      fieldName: "loginTagline",
      type: "string",
      required: false,
      label: "Login Page Tagline",
      maxLength: 150,
    },
    {
      fieldName: "enableSoundEffects",
      type: "boolean",
      required: false,
      label: "Enable Sound Effects",
    },
    {
      fieldName: "maxMessagesPerSession",
      type: "number",
      required: false,
      label: "Max Messages Per Session (0 = unlimited)",
      min: 0,
      max: 1000,
    },
  ],
};
