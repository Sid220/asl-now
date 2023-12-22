import streamlit as st
import pandas as pd
from pathlib import Path
import json

if_model_dir = Path("if_models")

st.title("ASLNow! Evaluation")
st.write(
    "If you understand this, you should help us improve [https://github.com/sid220/asl-now]("
    "https://github.com/sid220/asl-now)")
st.write("## Isolated FingerSpelling")

df = pd.read_csv(if_model_dir / "train_val_results.csv")

with open(if_model_dir / "test_results.json", "r") as f:
    test_results = json.load(f)
    test_loss = test_results[0]
    test_acc = test_results[1]

tab0, tab1, tab2 = st.tabs(["Model Info", "Accuracy", "Loss"])

with tab0:
    st.write("## Model Info")
    st.image(str(if_model_dir / "images/plotted_model.png"), caption="Plotted Model")
    st.image(str(if_model_dir / "images/layered_model.png"), caption="Layered Model")

with tab1:
    st.write("## Val & Train")
    acc_df = df.drop(["loss", "val_loss", "Unnamed: 0"], axis=1)
    st.line_chart(acc_df)

    st.write("### Val")
    st.image(str(if_model_dir / "images/confusion_matrix.png"), caption="Confusion Matrix")

    st.write("## Test")
    st.write("Accuracy: " + str(test_acc * 100) + "%")

with tab2:
    st.write("## Val & Train")
    loss_df = df.drop(["sparse_categorical_accuracy", "val_sparse_categorical_accuracy", "Unnamed: 0"], axis=1)
    st.line_chart(loss_df)

    st.write("## Test")
    st.write("Loss: " + str(test_loss))
