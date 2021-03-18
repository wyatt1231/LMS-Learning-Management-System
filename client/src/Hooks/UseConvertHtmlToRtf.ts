const UseConvertHtmlToRtf = (html: any) => {
  if (!(typeof html === "string" && html)) {
    return null;
  }

  var richText = html;

  richText = richText.replace(/<p><br><\/p>/gi, "\n\\par\n");

  richText = richText.replace(/<(?:br)(?:\s+[^>]*)?\s*[/]?>/gi, "\n\\par\n");

  // Empty tags
  // richText = richText.replace(
  //   /<(?:p|div|section|article)(?:\s+[^>]*)?\s*[\/]>/gi,
  //   // "{\\par\n"
  //   "\\par\n"
  // );
  // richText = richText.replace(/<(?:[^>]+)\/>/g, "");

  //start
  richText = richText.replace(/<(?:b|strong)(?:\s+[^>]*)?>/gi, "\n\\b\n");
  //end
  richText = richText.replace(/<\/(?:b|strong)(?:\s+[^>]*)?>/gi, "\n\\b0\n");

  //start
  richText = richText.replace(/<(?:i|em)(?:\s+[^>]*)?>/gi, "\n\\i\n");
  //end
  richText = richText.replace(/<\/(?:i|em)(?:\s+[^>]*)?>/gi, "\n\\i0\n");

  //start
  richText = richText.replace(/<(?:u|ins)(?:\s+[^>]*)?>/gi, "\n\\ul\n");
  //end
  richText = richText.replace(/<\/(?:u|ins)(?:\s+[^>]*)?>/gi, "\n\\ul0\n");

  //start
  richText = richText.replace(
    /<(?:strike|del)(?:\s+[^>]*)?>/gi,
    "\n\\strike\n"
  );
  //end
  richText = richText.replace(
    /<\/(?:strike|del)(?:\s+[^>]*)?>/gi,
    "\n\\strike0\n"
  );

  richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?>/gi, "");

  // End tags

  richText = richText.replace(
    /<\/(?:p|div|section|article)(?:\s+[^>]*)?>/gi,
    // "\n\\par\n"
    "\n\\par\n"
  );

  // richText = richText.replace(
  //   /<\/(?:b|strong|i|em|u|ins|strike|del|sup|sub)(?:\s+[^>]*)?>/gi,
  //   "\n"
  // );

  // Strip any other remaining HTML tags [but leave their contents]
  richText = richText.replace(/<(?:[^>]+)>/g, "");

  richText =
    "{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\fnil\\fcharset0 Arial;}}\n" +
    // "\\viewkind4\\uc1\\pard\\nowidctlpar\\hyphpar0\\kerning3\\fs22" +
    richText +
    // "\\pard\\kerning0\\f1\\fs20\\par" +
    "\n}";

  // console.log(`richText`, richText);

  return richText;
};

export default UseConvertHtmlToRtf;
