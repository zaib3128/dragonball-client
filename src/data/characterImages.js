// Maps character "id" (from backend data) -> local image import.
// Images can't travel through the JSON API, so the frontend resolves them here.

import gokuImg from '../assets/Goku.png';
import vegetaImg from '../assets/Vegeta.png';
import piccoloImg from '../assets/picoolo.png';
import gohanImg from '../assets/gohan.png';
import friezaImg from '../assets/frieza.png';
import bulmaImg from '../assets/bulma.png';
import android16Img from '../assets/android16.png';
import android17Img from '../assets/android17.png';
import cellImg from '../assets/cell.png';
import majinBuuImg from '../assets/buu.png';
import trunksImg from '../assets/Trunks.png';
import krillinImg from '../assets/krillin.png';
import chichiImg from '../assets/chichi.png';
import roshiImg from '../assets/roshi.png';
import tienImg from '../assets/tien.png';
import yamchaImg from '../assets/Yamcha.png';
import android18Img from '../assets/android18.png';
import beerusImg from '../assets/Beerus.png';
import whisImg from '../assets/Whis.png';
import gotenImg from '../assets/goten.png';
import kidTrunksImg from '../assets/kid_trunks.png';
import raditzImg from '../assets/raditz.png';

const characterImages = {
  goku: gokuImg,
  vegeta: vegetaImg,
  piccolo: piccoloImg,
  gohan: gohanImg,
  frieza: friezaImg,
  bulma: bulmaImg,
  'android-16': android16Img,
  'android-17': android17Img,
  cell: cellImg,
  'majin-buu': majinBuuImg,
  trunks: trunksImg,
  krillin: krillinImg,
  'chi-chi': chichiImg,
  'master-roshi': roshiImg,
  tien: tienImg,
  yamcha: yamchaImg,
  'android-18': android18Img,
  beerus: beerusImg,
  whis: whisImg,
  goten: gotenImg,
  'kid-trunks': kidTrunksImg,
  raditz: raditzImg,
};

export default characterImages;