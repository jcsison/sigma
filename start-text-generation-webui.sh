#!/bin/bash

# --------------------------------------------------
# Server config

CHARACTER="sigma"
GPU_MEMORY="3800MiB"
LOADER="exllama"
MAX_SEQ_LEN=4096
MODEL="TheBloke_Nous-Hermes-Llama-2-7B-GPTQ"

# --------------------------------------------------

pathToFileName() {
  local fileName=$(echo ${1##*/})
  echo "$fileName"
}

PROJECT_PATH=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
EXTERNAL_LIB_PATH=lib/external
TEXT_GENERATION_WEBUI_PATH=${EXTERNAL_LIB_PATH}/text-generation-webui

cd ${PROJECT_PATH}

if ! [ -d ${EXTERNAL_LIB_PATH} ]; then
  mkdir ${EXTERNAL_LIB_PATH}
fi

# Clone `text-generation-webui` into external lib dir
if ! [ -d ${TEXT_GENERATION_WEBUI_PATH} ]; then
  (cd ${EXTERNAL_LIB_PATH} && git clone https://github.com/oobabooga/text-generation-webui.git)
fi

if ! [ -L ${TEXT_GENERATION_WEBUI_PATH}/characters ]; then
  mv ${TEXT_GENERATION_WEBUI_PATH}/characters ${TEXT_GENERATION_WEBUI_PATH}/characters_old
  ln -s ${TEXT_GENERATION_WEBUI_PATH}/characters_old/instruction-following ${PROJECT_PATH}/characters/instruction-following
  ln -s ${PROJECT_PATH}/characters ${TEXT_GENERATION_WEBUI_PATH}/characters
fi

cd ${TEXT_GENERATION_WEBUI_PATH}

# Download model
if ! [ -d models/${MODEL} ]; then
  python download-model.py ${MODEL/_/\/}
fi

# Run server
conda run -n textgen --no-capture-output python server.py \
  --chat \
  --character ${CHARACTER} \
  --model ${MODEL} \
  --loader ${LOADER} \
  --gpu-memory ${GPU_MEMORY} \
  --max_seq_len ${MAX_SEQ_LEN} \
  --api
