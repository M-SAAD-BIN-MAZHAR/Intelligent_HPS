import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import streamlit as st
from components import show_header, show_footer
from components import back_to_dashboard_button


st.set_page_config(page_title="Doctor Dashboard", page_icon="👨‍⚕️")
show_header()


st.markdown("### 👨‍⚕️ Doctor Dashboard")
st.markdown("Here doctors can view patient reports, alerts, and insights.")


# TODO: Add doctor data dashboard later
st.info("Doctor dashboard under development.")

back_to_dashboard_button()
show_footer()