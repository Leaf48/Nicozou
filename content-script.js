// 1 loop = 20 videos
const getVideos = async (loop) => {
  const videos = [];
  for (let i = 1; i <= loop; i++) {
    const api = `https://nvapi.nicovideo.jp/v1/tmp/videos?count=20&_frontendId=6&_frontendVersion=0.0.0`;

    const res = await fetch(api);
    const data = await res.json();

    const _videos = data["data"]["videos"];

    for (let i of _videos) {
      videos.push(i);
    }
  }
  return videos;
};

const createVideoElm = (href, imgUrl, duration, title, description, date) => {
  const li = document.createElement("li");

  const a = document.createElement("a");
  a.href = href;
  a.className = "text_inherit text-decor_none [&:hover]:text-decor_underline";

  const divWrapper = document.createElement("div");
  divWrapper.className =
    "ssOnly:w_calc(100dvw_-_16px_*_2) sm:w_224px ssOnly:max-w_360px sm:max-w_auto ssOnly:min-h_auto sm:min-h_{sizes.VideoCard.height} pos_relative d_flex flex_column gap_8px overflow_hidden rounded_8px shadow_1px_2px_3px_rgba(0,_0,_0,_0.25)";

  const divImage = document.createElement("div");
  divImage.className = "pos_relative w_100% aspect_16_/_9 bg_#000";
  divImage.style.backgroundImage = `url(${imgUrl})`;
  divImage.style.backgroundSize = "contain";
  divImage.style.backgroundPosition = "center center";
  divImage.style.backgroundRepeat = "no-repeat";

  const spanDuration = document.createElement("span");
  spanDuration.className =
    "font_alnum rounded_4px pos_absolute right_8px bottom_8px bg_rgba(38,_38,_38,_0.8) border_1px_solid_#333 text_#fff fs_11px p_1px_5px";
  spanDuration.textContent = duration;

  divImage.appendChild(spanDuration);

  const divContent = document.createElement("div");
  divContent.className = "d_flex flex_column gap_4px p_0_8px_8px";

  const h2Title = document.createElement("h2");
  h2Title.className =
    "fs_13px m_0 max-h_calc(2_*_1.5em) leading_1.5em clamp_2 overflow_hidden";
  h2Title.textContent = title;

  const pDescription = document.createElement("p");
  pDescription.className =
    "fs_11px text_#666 max-h_calc(3_*_1.5em) leading_1.5em clamp_3 overflow_hidden";
  pDescription.textContent = description;

  const pEmpty = document.createElement("p");
  pEmpty.className =
    "fs_11px text_#666 h_calc(1_*_1.5em) leading_1.5em clamp_1 overflow_hidden";
  pEmpty.textContent = " ";

  divContent.appendChild(h2Title);
  divContent.appendChild(pDescription);
  divContent.appendChild(pEmpty);

  const pDate = document.createElement("p");
  pDate.className =
    "pos_absolute right_8px bottom_8px fs_11px text_#666 max-h_calc(1_*_1.5em) leading_1.5em";
  pDate.textContent = date;

  divWrapper.appendChild(divImage);
  divWrapper.appendChild(divContent);
  divWrapper.appendChild(pDate);

  a.appendChild(divWrapper);
  li.appendChild(a);

  return li;
};

const script = async () => {
  const xpath = "/html/body/div[3]/main/div/section/div[2]/div[1]/ul";
  const xpathResult = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  const ulElement = xpathResult.singleNodeValue;

  if (ulElement) {
    const videos = await getVideos(5);
    for (let i of videos) {
      const _li = createVideoElm(
        `/watch_tmp/${i["id"]}`,
        i["thumbnail"]["url"],
        i["duration"],
        i["title"],
        i["shortDescription"],
        i["registeredAt"]
      );
      ulElement.appendChild(_li);
    }
  } else {
    setTimeout(script, 100);
  }
};

script();
