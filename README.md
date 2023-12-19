# ASLNow!

[![DOI](https://img.shields.io/badge/10.57967%2Fhf%2F1494-doi?label=doi&color=blue)](https://doi.org/10.57967/hf/1494) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Sid220/asl-now/playwright.yml?logo=github&label=Tests) ![Vercel](https://vercelbadge.vercel.app/api/sid220/asl-now) [![Static Badge](https://img.shields.io/badge/Dataset-HuggingFace?label=HuggingFace)](https://huggingface.co/datasets/sid220/asl-now-fingerspelling)

ASLNow! is a web app designed to make learning ASL fingerspelling easy and fun! You can try it live
at [asl-now.vercel.app](https://asl-now.vercel.app/).

[main-demo.webm](https://github.com/Sid220/asl-now/assets/74916637/39410f98-67c5-4983-9b49-dbd0e1cf0e85)

## Datasets

### Isolated Fingerspelling

The dataset to train the fingerspelling model is licensed under the MIT License, and is available
at [https://huggingface.co/datasets/sid220/asl-now-fingerspelling](https://huggingface.co/datasets/sid220/asl-now-fingerspelling).
It will be updated frequently as more data is collected.

The dataset is collected from multiple participants told to sign ASL letters into a camera and detecting hand landmarks
using
the [Mediapipe Web Hand Landmarker Solution](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker/web_js).
The landmarks are then parsed into a JSON format, and stored in the folder of the class they belong to.

### Format

21 hand landmarks, each composed of `x`, `y` and `z` coordinates. The `x` and `y` coordinates are normalized
to `[0.0, 1.0]` by the
image width and height, respectively. The `z` coordinate represents the landmark depth, with the depth at the wrist
being
the origin. The smaller the value, the closer the landmark is to the camera. The magnitude of `z` uses roughly the same
scale as x.

![Hand Landmarks](https://developers.google.com/static/mediapipe/images/solutions/hand-landmarks.png)
From: [https://developers.google.com/mediapipe/solutions/vision/hand_landmarker](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)

Example (`./B/1d20c568-8641-40b6-9c4a-2bff97ab6b49.json`):

```json
[
  {
    "x": 0.795294463634491,
    "y": 0.8062881827354431,
    "z": 3.8308681382659415e-7
  },
  {
    "x": 0.7690186500549316,
    "y": 0.751120924949646,
    "z": -0.019963227212429047
  },
  ...
  {
    "x": 0.8564801812171936,
    "y": 0.5965726375579834,
    "z": 0.01904376409947872
  },
  {
    "x": 0.8578274846076965,
    "y": 0.5701698064804077,
    "z": 0.017703533172607422
  }
]
```

### Continuous Fingerspelling

The model used to detect continuous fingerspelling is not currently released. It uses
the [Google American Sign Language Fingerspelling Recognition Dataset](https://www.kaggle.com/competitions/asl-fingerspelling).
WARNING: Contains offensive/sexual language.

### Other Signs

The model used to detect other signs is not currently released. It uses
the [Google Isolated Sign Language Recognition Dataset](https://www.kaggle.com/competitions/asl-signs).