import streamlit as st
import os


def show_header():
   st.markdown("""
   <h1 style='text-align:center; color:#1E90FF;'>Smart Healthcare System 🏥</h1>
   <hr style='border:1px solid #1E90FF;'>
   """, unsafe_allow_html=True)


def show_footer():
   st.markdown("""
   <hr>
   <p style='text-align:center;'>© 2025 Smart Healthcare | All Rights Reserved</p>
   """, unsafe_allow_html=True)


def navigate_to_page(page_path):
   os.system(f"streamlit run {page_path}")
   
def back_to_dashboard_button(dashboard_page="pages/patient_dashboard.py"):
    """Reusable 'Back to Dashboard' button."""
    import streamlit as st
    st.markdown("<br>", unsafe_allow_html=True)
    if st.button("⬅️ Back to Dashboard", use_container_width=True):
        navigate_to_page(dashboard_page)
