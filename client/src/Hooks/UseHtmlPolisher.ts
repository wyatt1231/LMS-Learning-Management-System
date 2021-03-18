export const UseHtmlPolisher = (html: any | null | undefined): string => {
  if (html == null || typeof html == "undefined") {
    return "";
  } else {
    // console.log(`unplished`, html);
    // let polishedHtml = html.replaceAll(/(<[^>]+) style=".*?">/gi, "<p>");
    let polishedHtml = html.replaceAll(/(style=".*?")/gi, "");

    // polishedHtml = polishedHtml.replaceAll("<p><br></p>", "<p></p>");

    // polishedHtml = polishedHtml + "<p><br><br><br></p><p>test</p>";
    return polishedHtml;
  }
};

export const UseHtmlStyleRemover = (html: any | null | undefined): string => {
  if (html == null || typeof html == "undefined") {
    return "";
  } else {
    let polishedHtml = html.replaceAll(/(<[^>]+) style=".*?">/gi, "");
    return polishedHtml;
  }
};
